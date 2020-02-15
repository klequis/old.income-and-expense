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
