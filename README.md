## A program for categorizing and reporting on banking data. 

- Categorizes each transaction in two levels (done)
- Creates report of spending by year (soon) (other reports to come)

## How it works (in brief)

Currently can only be used by geeks. But then, you are looking at GitHub so you are a geek.

- Download transaction data from bank (e.g., checking, savings, credit card).
- Create function to map columns to required form form and do basic cleanup such as trim, format date.
  - Each institution and sometimes different account types within the same institution have different columns and format. Order columns and clean data.
- Create JSON file to describe categories. Uses RegEx to match on transaction description.
- Run the app

More detail to come.

## Motivation

I tried Quicken and Microsoft Money years ago. I had problems with data duplication and being unable to recategorize data. This was a long time ago so they may be better now. As a result, each year, to prepare for taxes, I spend days working with data in Excel typing until my fingers are sore. This project gives me a reusable process.

Additionally:
- I don't want to share my data with 3rd parties.
- I don't need another monthly subscription. They tend to add-up.

If you are interested in this project open an issue labeled 'question'. Let me know :
- if you have interest in the project.
- if you have tried paid solutions and have been unsatisfied.