from PIL import Image, ImageEnhance, ImageFilter
import sys
import os

def apply_style(input_path, output_path, style):
    img = Image.open(input_path)

    if style == "Ghibli":
        enhancer = ImageEnhance.Color(img)
        img = enhancer.enhance(2.0)
        img = img.filter(ImageFilter.SMOOTH_MORE)

    elif style == "Cartoon":
        img = img.filter(ImageFilter.EDGE_ENHANCE_MORE)
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.8)

    elif style == "Sketch":
        img = img.convert("L").filter(ImageFilter.FIND_EDGES)

    elif style == "3D":
        img = img.filter(ImageFilter.EMBOSS)

    else:
        print("WARNING: Unknown style. No filter applied.")

    img.save(output_path)
    print("✅ Styled image saved to:", output_path)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("ERROR: Please provide a style name.")
        sys.exit(1)

    style = sys.argv[1]
    input_path = os.path.join("public", "style_input.png")
    output_path = os.path.join("public", "styled_output.png")

    apply_style(input_path, output_path, style)
