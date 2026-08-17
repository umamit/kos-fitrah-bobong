import os
from PIL import Image

def generate_logo_versions():
    src = "/Users/husnitausman/.gemini/antigravity/brain/43eab737-52bb-4186-bcf0-b300a8ad24f1/media__1784299261305.png"
    img = Image.open(src).convert("RGBA")
    width, height = img.size
    
    # Cream color background
    bg_samples = [
        img.getpixel((5, 5)),
        img.getpixel((width - 6, 5)),
        img.getpixel((5, height - 6)),
        img.getpixel((width - 6, height - 6))
    ]
    avg_r = sum(s[0] for s in bg_samples) // len(bg_samples)
    avg_g = sum(s[1] for s in bg_samples) // len(bg_samples)
    avg_b = sum(s[2] for s in bg_samples) // len(bg_samples)
    
    threshold = 40
    new_data = []
    
    for y in range(height):
        for x in range(width):
            r, g, b, a = img.getpixel((x, y))
            distance = ((r - avg_r)**2 + (g - avg_g)**2 + (b - avg_b)**2)**0.5
            if distance < threshold:
                new_data.append((r, g, b, 0))
            elif distance < threshold + 15:
                alpha = int(255 * (distance - threshold) / 15)
                new_data.append((r, g, b, alpha))
            else:
                new_data.append((r, g, b, 255))
                
    rgba_img = Image.new("RGBA", (width, height))
    rgba_img.putdata(new_data)
    
    # Let's save a series of crops to find the perfect split points
    # Bbox of whole image is (61, 0, 1000, 558)
    
    # Version 1: Symbol ONLY (y from 0 to 330)
    symbol_only = rgba_img.crop((61, 0, 1000, 330))
    symbol_only_bbox = symbol_only.getbbox()
    if symbol_only_bbox:
        symbol_only = symbol_only.crop(symbol_only_bbox)
    symbol_only.save("scratch/logo_symbol_only.png")
    print("Saved logo_symbol_only.png, size:", symbol_only.size)
    
    # Version 2: Symbol + Text 'KOST FITRAH' (y from 0 to 450)
    symbol_text = rgba_img.crop((61, 0, 1000, 450))
    symbol_text_bbox = symbol_text.getbbox()
    if symbol_text_bbox:
        symbol_text = symbol_text.crop(symbol_text_bbox)
    symbol_text.save("scratch/logo_symbol_text.png")
    print("Saved logo_symbol_text.png, size:", symbol_text.size)
    
    # Version 3: Full Logo (y from 0 to 558)
    full_logo = rgba_img.crop((61, 0, 1000, 558))
    full_logo_bbox = full_logo.getbbox()
    if full_logo_bbox:
        full_logo = full_logo.crop(full_logo_bbox)
    full_logo.save("scratch/logo_full.png")
    print("Saved logo_full.png, size:", full_logo.size)

if __name__ == "__main__":
    generate_logo_versions()
