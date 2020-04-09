# tmp

## EDITS

## Chase
- has only Amount
- (-) is debit/expense  => account balance goes down
- (+) is credit/income => account balance goes up

## Costco
- has Debit & Credit columns
- (+) is debit/expense  >>>> make this (-)
- (-) is credit/income  >>>> make this (+)


Debit
- checking is a (-) number
- credit   is a (+) number (costco only so far)


Important Note

In this program
- Any money you spend is a debit & must be a (-) number.
- Any money you receive is a credit & must be a (+) number
- Any money that is transferred between accounts should be omitted
  - E.g., a debit from a checking account to pay/credit a credit card. Both the debit in checking and the payment/debit in the credit card accounts must be omitted.



An account can have an 'Amount' column which contains both positive & negative numbers.

Money to you is income
Money away from you is expense



Acct 1 only has an amout column.
- Gasoline is an expense and (-), so that is good
- Return-refund is income and (+), so that is good as well
- Payment is entered as a credit but it is not income nor an expense so needs to be excluded. You'll see how to do that later.


| Description   | Amount  |
|---------------|---------|
| Gasoline      |  -40.34 |
| Gym           |  -44.99 |
| Grocery       | -114.95 |
| Payment       |   44.99 |
| Return-refund |   95.00 |


Account 2
- Has both a credit and debit column
- Spending money on Dukin Donuts cost 2.58 and is listed as a debit.
  - Since it is money I spend it is a debit but like all debits it should be (-)
- COSTCO RETURN is a credit, I received money so credit is correct, but like all credits it should be (+)




### Edits


## A program for categorizing and reporting on banking data.

- Categorizes each transaction in two levels (done)
- Creates report of spending by year (soon) (other reports to come)

## How it works (in brief)

Currently can only be used by geeks. But then, you are looking at GitHub so you are a geek.

- Download transaction data from bank (e.g., checking, savings, credit card) in CSV format.
- Add config data to MongoDB to map required fields to column in CSV file.
  - Each institution and sometimes different account types within the same institution have different columns order, column names or no column names.

```json
{
    "_id" : ObjectId("5e46eef3626be23800bbb040"),
    "acctId" : "[name].[institutionName].[accountType].[accountNumLast4]",
    "dataFile" : {
        "name" : "[name].[institutionName].[accountType].[accountNumLast4].csv"
    },
    "fieldToCol" : {
        "date" : {
            "col" : 2
        },
        "description" : {
            "col" : 3
        },
        "debit" : {
            "col" : 4,
            "parse" : "<0"
        },
        "credit" : {
            "col" : 4,
            "parse" : ">0"
        },
        "typeOrig" : {
            "col" : 5
        },
        "checkNumber" : {
            "col" : 7
        }
    }
}
```

- Add config data to MongodB to categorize transactions.

E.g., The description field is 'ATM CHECK DEPOSIT Your Town NM PID: 123456' and the' Your Town NM PID: 123456' part of the string is not needed. The town and PID number will vary. The below looks in the 'description' field for a string that begins with 'ATM CHECK DEPOSIT', replaces it with 'ATM CHECK DEPOSIT' and categorizes it as income / my-job.

```json
{
    "_id" : ObjectId("5e45ca2f6d8f4438b8ee5930"),
    "acct" : "[name].[institutionName].[accountType].[accountNumLast4]",
    "criteria" : [
        {
            "field" : "description",
            "operation" : "beginsWith",
            "value" : "ATM CHECK DEPOSIT"
        }
    ],
    "actions" : [
        {
            "action" : "replaceAll",
            "field" : "description",
            "replaceWithValue" : "ATM CHECK DEPOSIT"
        },
        {
            "action" : "categorize",
            "category1" : "income",
            "category2" : "my-job"
        }
    ]
}
```

More detail to come.

## Motivation

I tried Quicken and Microsoft Money years ago. I had problems with data duplication and being unable to recategorize data. This was a long time ago so they may be better now. As a result, each year, to prepare for taxes, I spend days working with data in Excel typing until my fingers are sore. This project gives me a reusable process.

Additionally:
- I don't want to share my data with 3rd parties.
- I don't need another monthly subscription. They tend to add-up.

If you are interested in this project open an issue labeled 'question'.
