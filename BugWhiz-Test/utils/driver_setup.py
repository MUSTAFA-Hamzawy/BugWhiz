from selenium import webdriver
import time

def get_driver():
    driver = webdriver.Chrome()
    time.sleep(2)
    return driver
