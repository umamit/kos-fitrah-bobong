import os
from PIL import Image

def find_logo_elements():
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
    
    # Create mask of foreground pixels
    mask = Image.new("L", (width, height), 0)
    for y in range(height):
        for x in range(width):
            r, g, b, a = img.getpixel((x, y))
            distance = ((r - avg_r)**2 + (g - avg_g)**2 + (b - avg_b)**2)**0.5
            if distance >= threshold:
                mask.putpixel((x, y), 255)
                
    # Get bounding box of all foreground
    bbox = mask.getbbox()
    print("Full bounding box of foreground:", bbox)
    
    # Let's count foreground pixels per row inside the bounding box
    row_counts = []
    for y in range(bbox[1], bbox[3]):
        fg_in_row = 0
        for x in range(bbox[0], bbox[2]):
            if mask.getpixel((x, y)) == 255:
                fg_in_row += 1
        row_counts.append((y, fg_in_row))
        
    # Print the row counts in the middle area to find the vertical gap
    # The image height is 558, bbox is likely between ~100 and ~500.
    # Let's find rows with very low foreground counts (local minima)
    print("\nScanning for horizontal gaps between components:")
    for y, count in row_counts:
        # Show rows that have very low density compared to maximum row density
        if count < 30:
            print(f"Row {y}: {count} pixels")

if __name__ == "__main__":
    find_logo_elements()
