from selenium.webdriver.common.by import By

class BasePage:
    def __init__(self, driver):
        self.driver = driver

    def click(self, by_locator):
        self.driver.find_element(by_locator[0], by_locator[1]).click()

    def enter_text(self, by_locator, text):
        self.driver.find_element(by_locator[0], by_locator[1]).clear()
        self.driver.find_element(by_locator[0], by_locator[1]).send_keys(text)

    def get_text(self, by_locator):
        return self.driver.find_element(by_locator[0], by_locator[1]).text

    def is_visible(self, by_locator):
        element = self.driver.find_element(by_locator[0], by_locator[1])
        return element.is_displayed()
