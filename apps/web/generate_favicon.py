"""
Generate favicon files from the Golden Atom logo
Run: python generate_favicon.py
"""

from PIL import Image
import os

# Paths
LOGO_PATH = "public/assets/img/axionax-logo-new.png"
OUTPUT_DIR = "public"

def remove_black_background(img, threshold=30):
    """Remove black background and make it transparent"""
    img = img.convert('RGBA')
    data = img.getdata()
    
    new_data = []
    for item in data:
        # If pixel is close to black, make it transparent
        if item[0] < threshold and item[1] < threshold and item[2] < threshold:
            new_data.append((0, 0, 0, 0))  # Transparent
        else:
            new_data.append(item)
    
    img.putdata(new_data)
    return img

def generate_favicon():
    print("🎨 Generating favicon from Golden Atom logo...")
    print("   (with transparent background)")
    
    # Open the original logo
    img = Image.open(LOGO_PATH)
    
    # Convert to RGBA if needed
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Remove black background
    img = remove_black_background(img)
    
    # Get the center crop (square)
    width, height = img.size
    size = min(width, height)
    left = (width - size) // 2
    top = (height - size) // 2
    right = left + size
    bottom = top + size
    img = img.crop((left, top, right, bottom))
    
    # Generate different sizes
    sizes = {
        'favicon-16x16.png': 16,
        'favicon-32x32.png': 32,
        'apple-touch-icon.png': 180,
    }
    
    for filename, target_size in sizes.items():
        output_path = os.path.join(OUTPUT_DIR, filename)
        resized = img.resize((target_size, target_size), Image.Resampling.LANCZOS)
        resized.save(output_path, 'PNG')
        print(f"  ✅ Created {filename} ({target_size}x{target_size})")
    
    # Generate ICO file (multiple sizes)
    ico_path = os.path.join(OUTPUT_DIR, 'favicon.ico')
    ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
    ico_images = [img.resize(s, Image.Resampling.LANCZOS) for s in ico_sizes]
    ico_images[0].save(ico_path, 'ICO', sizes=ico_sizes)
    print(f"  ✅ Created favicon.ico (multi-size)")
    
    print("\n✨ Favicon generation complete (transparent background)!")

if __name__ == "__main__":
    generate_favicon()
