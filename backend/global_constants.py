image_urls = []

def get_image_url():
    return image_urls

def set_image_urls(url: str):
    global image_urls
    if(url not in image_urls):
        image_urls.append(url)



