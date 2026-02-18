import string

def strings(filename, min_len=4):
    with open(filename, "rb") as f:
        result = ""
        while True:
            chunk = f.read(1024 * 1024)
            if not chunk:
                break
            for b in chunk:
                c = chr(b)
                if c in string.printable and c not in ['\r', '\n', '\t', '\x0c', '\x0b']:
                    result += c
                else:
                    if len(result) >= min_len:
                        yield result
                    result = ""
        if len(result) >= min_len:
            yield result

if __name__ == "__main__":
    for s in strings("Assets/st-marys-magazine-2025.pdf", min_len=6):
        # Skip obvious PDF binary/structure tokens
        if any(x in s for x in ["endobj", "endstream", "xref", "trailer", "startxref", "/Type", "/Font", "/Page", "<<", ">>"]):
            continue
        print(s)
