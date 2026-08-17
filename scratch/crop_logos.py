import os
from PIL import Image

def crop_logos_whiteness():
    src = "/Users/husnitausman/.gemini/antigravity/brain/43eab737-52bb-4186-bcf0-b300a8ad24f1/media__1784299261305.png"
    img = Image.open(src).convert("RGBA")
    width, height = img.size
    
    new_data = []
    
    # Cream/white background: R > 200, G > 195, B > 185
    for y in range(height):
        for x in range(width):
            r, g, b, a = img.getpixel((x, y))
            
            # If the pixel is very bright (whiteness/creaminess detection)
            if r > 195 and g > 190 and b > 180:
                new_data.append((r, g, b, 0)) # Make completely transparent
            # Soft transition for edge anti-aliasing
            elif r > 180 and g > 175 and b > 165:
                avg_val = (r + g + b) / 3.0
                alpha = int(255 * (1.0 - (avg_val - 173) / (255 - 173)))
                alpha = max(0, min(255, alpha))
                new_data.append((r, g, b, alpha))
            else:
                new_data.append((r, g, b, 255))
                
    rgba_img = Image.new("RGBA", (width, height))
    rgba_img.putdata(new_data)
    
    # Find bounding box of non-transparent pixels
    bbox = rgba_img.getbbox()
    print("New whiteness bbox:", bbox)
    
    if bbox:
        padding = 10
        
        # 1. Full logo (symbol + text)
        # Sliced right side at x=935 to exclude the vertical strip on the far right (x >= 960)
        left = max(0, bbox[0] - padding)
        top = max(0, bbox[1] - padding)
        right = min(935, bbox[2] + padding)
        bottom = min(height, bbox[3] + padding)
        
        full_logo = rgba_img.crop((left, top, right, bottom))
        full_bbox = full_logo.getbbox()
        if full_bbox:
            full_logo = full_logo.crop(full_bbox)
        full_logo.save("assets/logo.png", "PNG")
        print("Saved assets/logo.png, size:", full_logo.size)
        
        # 2. Symbol only (monogram KF + roof)
        # Sliced right side at x=935 and bottom at y=345 to exclude text and vertical strip
        symbol_bottom = 345
        symbol_left = bbox[0] - padding
        symbol_top = max(0, bbox[1] - padding)
        symbol_right = min(935, bbox[2] + padding)
        
        symbol_logo = rgba_img.crop((symbol_left, symbol_top, symbol_right, symbol_bottom))
        symbol_bbox = symbol_logo.getbbox()
        if symbol_bbox:
            symbol_logo = symbol_logo.crop(symbol_bbox)
            
        symbol_logo.save("assets/logo-symbol.png", "PNG")
        print("Saved assets/logo-symbol.png, size:", symbol_logo.size)

if __name__ == "__main__":
    crop_logos_whiteness()
