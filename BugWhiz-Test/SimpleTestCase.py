from selenium import webdriver
from selenium.webdriver.common.by import By
import time

# 1- open web browser chrome
driver = webdriver.Chrome()

# 2- open URL: http://localhost:3000/login
driver.get("http://localhost:3000")

#make sure the page is loaded
time.sleep(2)

# Make sure title is Login using relative xpath
title = driver.find_element(By.XPATH, "//h1[normalize-space()='Login']")
assert title.text == "Login"

if title.text == "Login":
    print("Title is correct")
else:
    print("Title is incorrect")