import requests
from bs4 import BeautifulSoup
import time
import json
import os

BASE_URL = "https://www.pgmustard.com"
START_URL = f"{BASE_URL}/docs/explain"
HEADERS = {"User-Agent": "Mozilla/5.0"}
DELAY_SECONDS = 0.5

cache_file_json = "pgmustard_fields.json"
cache_file_ts = "pgmustard_fields.ts"


def scrape_operation_descriptions():
    result = {}

    main_soup = get_soup(START_URL)
    operations_by_category = extract_operation_links(main_soup)

    for section, ops in operations_by_category.items():
        for op_name, op_url in ops:
            print(f"\n📘 Fetching operation: {op_name}")
            try:
                soup = get_soup(BASE_URL + op_url)
                outer_div = soup.find("div", class_="row sqs-row")
                if not outer_div:
                    raise ValueError("Outer .row.sqs-row not found")

                inner_div = outer_div.find("div", class_="row sqs-row")
                if not inner_div:
                    raise ValueError("Inner .row.sqs-row not found")

                description_text = inner_div.get_text("\n", strip=True)
                result[op_name] = description_text

            except Exception as e:
                print(f"⚠️ Skipped {op_name} due to error: {e}")

    return result


def get_soup(url: str) -> BeautifulSoup:
    print(f"Fetching: {url}")
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    time.sleep(DELAY_SECONDS)
    return BeautifulSoup(response.text, "html.parser")


def extract_operation_links(soup: BeautifulSoup) -> dict:
    operation_sections = {}
    for h3 in soup.find_all("h3"):
        if "operation" in h3.get_text(strip=True).lower():
            section_name = h3.get_text(strip=True)
            ul = h3.find_next_sibling("ul")
            if not ul:
                continue
            links = ul.find_all("a")
            op_names = [link.get_text(strip=True) for link in links]
            op_urls = [link["href"] for link in links if link.has_attr("href")]
            operation_sections[section_name] = list(zip(op_names, op_urls))
    return operation_sections


def extract_field_links(op_url: str) -> list:
    soup = get_soup(BASE_URL + op_url)
    fields = []
    for h3 in soup.find_all("h3"):
        if "field" in h3.get_text(strip=True).lower():
            ul = h3.find_next_sibling("ul")
            if not ul:
                continue
            for a in ul.find_all("a", href=True):
                fields.append((a.get_text(strip=True), a["href"]))
            break
    return fields


def extract_field_description(field_url: str) -> str:
    soup = get_soup(BASE_URL + field_url)

    # Step 1: Find the <h1> tag
    h1 = soup.find("h1")
    if not h1:
        raise ValueError("No <h1> found on the page")

    # Step 2: Find the first .sqs-html-content div that contains the h1
    all_html_divs = soup.find_all("div", class_="sqs-html-content")
    h1_container_index = None
    for i, div in enumerate(all_html_divs):
        if div.find("h1"):
            h1_container_index = i
            break

    if h1_container_index is None:
        raise ValueError(
            "Couldn't find .sqs-html-content container for the <h1>")

    # Step 3: Look for the next .sqs-html-content div AFTER the h1 container
    for div in all_html_divs[h1_container_index + 1:]:
        text = div.get_text(strip=True)
        if text:  # Make sure it isn't empty
            return div.get_text("\n", strip=True)

    raise ValueError(
        "No description found in any .sqs-html-content after the <h1>")


def scrape_pgmustard():
    result = {}

    main_soup = get_soup(START_URL)
    operations_by_category = extract_operation_links(main_soup)

    for section, ops in operations_by_category.items():
        for op_name, op_url in ops:
            print(f"\n📘 Operation: {op_name}")
            if op_name not in result:
                result[op_name] = {}

            field_links = extract_field_links(op_url)
            for field_name, field_url in field_links:
                if field_name in result[op_name]:
                    continue  # avoid duplicates within the operation
                try:
                    desc = extract_field_description(field_url)
                    result[op_name][field_name] = desc
                except Exception as e:
                    print(f"⚠️ Failed to get {field_name} at {field_url}: {e}")

    return result


def write_json(data):
    with open(cache_file_json, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"✅ Saved JSON to {cache_file_json}")


def write_ts(data):
    with open(cache_file_ts, "w", encoding="utf-8") as f:
        f.write("// Auto-generated from pgMustard scraper\n")
        f.write(
            "export const pgMustardFields: Record<string, Record<string, string>> = ")
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write(";\n")
    print(f"✅ Saved TS to {cache_file_ts}")


if __name__ == "__main__":
    print("🚀 Scraping pgMustard operation descriptions...")
    data = scrape_operation_descriptions()

    # Write output
    write_json(data)

    with open(cache_file_ts, "w", encoding="utf-8") as f:
        f.write("// Auto-generated operation descriptions from pgMustard\n")
        f.write(
            "export const pgMustardOperationDescriptions: Record<string, string> = ")
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write(";\n")

    print("🏁 Done!")
