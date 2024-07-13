import unittest
import coverage
from tests.test_login import TestLogin

# Start coverage measurement
cov = coverage.Coverage(source=["pages", "utils"])
cov.start()

# Create a TestSuite and add the test cases
suite = unittest.TestSuite()
suite.addTest(unittest.makeSuite(TestLogin))

# Run the tests
runner = unittest.TextTestRunner()
runner.run(suite)

# Stop coverage measurement and save report
cov.stop()
cov.save()
cov.html_report(directory='coverage_reports/login')
