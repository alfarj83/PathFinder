import os
import requests
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
from PIL import Image
import io
import sys

def download_professor_image(page_url, output_dir='.'):
    # Download HTML
    resp = requests.get(page_url)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, 'html.parser')

    # Extract slug from URL (ex: "mohammed-zaki")
    prof_dashed = os.path.basename(urlparse(page_url).path)


    # save url to be used in the sql insert
    with open("../temps/sql_insert.sql", "w", encoding="utf-8") as f:
        f.write(page_url)

    # -----------------------------
    # Locate correct profile image
    # -----------------------------
    photo_div = soup.find("div", class_="faculty-photo")
    if not photo_div:
        raise RuntimeError("Could not find faculty-photo container")

    img_tag = photo_div.find("img")
    if not img_tag or not img_tag.get("src"):
        raise RuntimeError("Could not find image in faculty-photo container")

    img_url = urljoin(page_url, img_tag["src"])

    # Download the image file
    img_resp = requests.get(img_url)
    img_resp.raise_for_status()

    # Try reading with Pillow
    try:
        img = Image.open(io.BytesIO(img_resp.content))
    except Exception as e:
        print("ERROR: Could not decode image!")
        print("URL:", img_url)
        raise

    # Convert to RGB JPG format
    img = img.convert("RGB")

    # Save as .jpg
    output_path = os.path.join(output_dir, f"{prof_dashed}.jpg")
    img.save(output_path, "JPEG", quality=95)

    print(f"Saved: {output_path}")


if __name__ == "__main__":

    fac_url = "new"
    if len(sys.argv) > 1:
        fac_url = sys.argv[1]
    # put in the big string of it here

    if(fac_url == "new"):
        with open("../temps/full_names.txt", "r", encoding="utf-8") as f:
            name = f.readline().strip()
            urled_name = name.lower().replace(" ", "-")
            fac_url = "https://faculty.rpi.edu/" + urled_name


    download_professor_image(fac_url, output_dir="../imgs")
