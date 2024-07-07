class BasePage:
    def __init__(self, driver):
        self.driver = driver

    def go_to_url(self, url):
        self.driver.get(url)
