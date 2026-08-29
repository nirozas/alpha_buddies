import os
from PIL import Image

# Configuration
SOURCE_DIR = r"C:\Users\asnir\.gemini\antigravity\brain\6de2da06-608c-4a37-a207-320cedaa1205"
OUTPUT_DIR = r"f:\Apps & websites\4. LearnPK\public\coloring-pages"
os.makedirs(OUTPUT_DIR, exist_ok=True)

SHEETS = [
    {
        "file": "media__1777853775699.png", # Bubble
        "name": "bubble",
        "cols": 5, "rows": 6, "letters": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "crop_area": (40, 10, 1000, 1400) # (left, top, right, bottom)
    },
    {
        "file": "media__1777853790678.png", # Animal Simple
        "name": "animal",
        "cols": 7, "rows": 4, "letters": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "crop_area": (100, 10, 1820, 1000)
    },
    {
        "file": "media__1777853615984.png", # Object
        "name": "object",
        "cols": 7, "rows": 4, "letters": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "crop_area": (10, 10, 730, 480)
    }
]

def process_sheet(sheet):
    img = Image.open(os.path.join(SOURCE_DIR, sheet["file"]))
    left, top, right, bottom = sheet["crop_area"]
    width = (right - left) / sheet["cols"]
    height = (bottom - top) / sheet["rows"]
    
    letters = sheet["letters"]
    for i, char in enumerate(letters):
        col = i % sheet["cols"]
        row = i // sheet["cols"]
        
        c_left = left + col * width
        c_top = top + row * height
        c_right = c_left + width
        c_bottom = c_top + height
        
        crop = img.crop((c_left, c_top, c_right, c_bottom))
        # Trim white space? Optional.
        
        filename = f"{char}_{sheet['name']}.png"
        crop.save(os.path.join(OUTPUT_DIR, filename))
        print(f"Saved {filename}")

if __name__ == "__main__":
    for sheet in SHEETS:
        try:
            process_sheet(sheet)
        except Exception as e:
            print(f"Error processing {sheet['name']}: {e}")
