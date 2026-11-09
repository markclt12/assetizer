export interface SeedQuestion {
  prompt: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

export interface SeedTopic {
  slug: string;
  title: string;
  illustration: string;
  lesson: { title: string; content: string };
  activity: { title: string; questions: SeedQuestion[] };
  caseStudy: { title: string; content: string };
}

export interface SeedCategory {
  slug: string;
  title: string;
  description: string;
  topics: SeedTopic[];
}

export const seedCategories: SeedCategory[] = [
  {
    slug: "current",
    title: "Current ASSETizers",
    description:
      "Assets expected to be turned into cash, sold, or used up within one year or one operating cycle.",
    topics: [
      {
        slug: "cash",
        title: "CASHew",
        illustration: "/illustrations/cashew.svg",
        lesson: {
          title: "All about CASHew",
          content: `## What is cash?

Cash is the most liquid asset a business owns. It includes coins and currency on hand, money in bank checking and savings accounts, and items a bank will accept for immediate deposit, such as customer checks.

Cash equivalents are short-term, highly liquid investments that are readily convertible to a known amount of cash and close enough to maturity (generally three months or less) that their value barely changes.

## Why it matters

Cash pays the bills. A company can be profitable on paper and still fail if it runs out of cash, so cash is reported first on the balance sheet and is tightly controlled.

### Included in cash and cash equivalents

- Petty cash and cash on hand
- Checking and savings accounts
- Money market funds
- Treasury bills maturing within 3 months

### Not included

- Postdated checks from customers
- Restricted cash (e.g. a sinking fund)
- Bank overdrafts (a liability)
- Stamps and IOUs from employees
`,
        },
        activity: {
          title: "Cashew Practice Bite",
          questions: [
            {
              prompt: "Which of the following is classified as cash and cash equivalents?",
              options: [
                "A postdated customer check",
                "A 60-day treasury bill",
                "Postage stamps",
                "A 2-year certificate of deposit",
              ],
              correctIdx: 1,
              explanation:
                "Cash equivalents are highly liquid investments maturing within three months of acquisition, like a 60-day treasury bill.",
            },
            {
              prompt: "A bank overdraft is generally reported as:",
              options: ["A reduction of cash", "A current asset", "A current liability", "Equity"],
              correctIdx: 2,
              explanation: "An overdraft means the company owes the bank money, so it is a liability.",
            },
            {
              prompt: "Why is cash listed first among current assets?",
              options: [
                "It is the largest asset",
                "It is the most liquid asset",
                "It never changes in value",
                "It is required by tax law",
              ],
              correctIdx: 1,
              explanation: "Current assets are listed in order of liquidity, and cash is already cash.",
            },
            {
              prompt: "Cash set aside in a sinking fund to repay long-term debt is:",
              options: [
                "Cash on hand",
                "A cash equivalent",
                "Restricted cash, usually non-current",
                "An expense",
              ],
              correctIdx: 2,
              explanation:
                "Cash restricted for a long-term purpose is not available for current operations and is reported separately.",
            },
            {
              prompt: "Which internal control best protects cash?",
              options: [
                "One employee handles receipts, deposits and recording",
                "Separating custody of cash from record-keeping",
                "Depositing cash once a month",
                "Never reconciling the bank statement",
              ],
              correctIdx: 1,
              explanation:
                "Segregation of duties makes it harder for one person to both take cash and hide it in the records.",
            },
          ],
        },
        caseStudy: {
          title: "CASHew Case Study",
          content: `## The Cashew Corner cafe

Cashew Corner is a small cafe. At year end, the owner lists these items and asks what can be reported as **cash and cash equivalents**:

| Item | Amount |
|---|---|
| Cash in register | 1,200 |
| Checking account | 18,500 |
| 2-month treasury bill | 5,000 |
| Postdated customer check | 800 |
| Sinking fund for equipment loan | 10,000 |

### Work it through

- Cash in register, checking account and the 2-month treasury bill qualify: **24,700**.
- The postdated check is a receivable until its date.
- The sinking fund is restricted cash and reported as a non-current asset.

### Takeaway

Only amounts that are unrestricted and available right now (or within three months) belong in cash and cash equivalents.
`,
        },
      },
      {
        slug: "accounts-receivable",
        title: "Accounts Receivable",
        illustration: "/illustrations/taco.svg",
        lesson: {
          title: "All about Accounts Receivable",
          content: `## What are receivables?

Accounts receivable are amounts customers owe the business for goods or services already delivered on credit. They are a promise of future cash.

## Measuring receivables

Not every customer pays. Receivables are reported at **net realizable value**: the gross amount owed minus an allowance for doubtful accounts.

### Key terms

- Credit sale
- Allowance for doubtful accounts
- Bad debt expense
- Net realizable value

### Common journal entries

- Sale on credit: debit A/R, credit Sales
- Collection: debit Cash, credit A/R
- Estimate bad debts: debit Bad Debt Expense, credit Allowance
- Write-off: debit Allowance, credit A/R
`,
        },
        activity: {
          title: "Receivables Practice Bite",
          questions: [
            {
              prompt: "Accounts receivable arise from:",
              options: ["Cash sales", "Credit sales", "Owner investments", "Bank loans"],
              correctIdx: 1,
              explanation: "Receivables are created when goods or services are sold on credit.",
            },
            {
              prompt: "Receivables are reported on the balance sheet at:",
              options: ["Gross amount", "Net realizable value", "Fair value of inventory", "Historical cost of sales"],
              correctIdx: 1,
              explanation: "Gross receivables less the allowance for doubtful accounts equals net realizable value.",
            },
            {
              prompt: "The allowance for doubtful accounts is a:",
              options: ["Liability", "Expense", "Contra-asset", "Revenue"],
              correctIdx: 2,
              explanation: "It reduces the asset Accounts Receivable, so it is a contra-asset account.",
            },
            {
              prompt: "Under the allowance method, writing off a specific bad account:",
              options: [
                "Increases expenses",
                "Decreases net receivables",
                "Does not change net receivables",
                "Increases cash",
              ],
              correctIdx: 2,
              explanation:
                "The write-off reduces both A/R and the Allowance by the same amount, so net receivables are unchanged.",
            },
            {
              prompt: "Gross A/R is 50,000 and the allowance is 2,000. Net realizable value is:",
              options: ["52,000", "50,000", "48,000", "2,000"],
              correctIdx: 2,
              explanation: "50,000 - 2,000 = 48,000.",
            },
          ],
        },
        caseStudy: {
          title: "Accounts Receivable Case Study",
          content: `## Taco Truck Catering

Taco Truck Catering bills corporate clients on 30-day terms. At year end, receivables total **80,000**. Based on experience, the owner estimates **3%** will never be collected.

### Work it through

- Allowance needed: 80,000 x 3% = **2,400**
- Entry: debit Bad Debt Expense 2,400, credit Allowance for Doubtful Accounts 2,400
- Balance sheet: Accounts Receivable, net = **77,600**

### Takeaway

Estimating bad debts matches the expense to the period of the sale, and keeps receivables from being overstated.
`,
        },
      },
      {
        slug: "inventory",
        title: "Inventory",
        illustration: "/illustrations/nachos.svg",
        lesson: {
          title: "All about Inventory",
          content: `## What is inventory?

Inventory is goods a business holds for sale in the ordinary course of business, plus materials and work in progress for manufacturers.

## Cost flow assumptions

When identical items are bought at different prices, a cost flow assumption decides which cost goes to cost of goods sold (COGS) and which stays in ending inventory.

### Cost flow methods

- FIFO: first in, first out
- Weighted average cost
- Specific identification
- LIFO (not allowed under IFRS)

### Valuation rules

- Start at cost (purchase price + freight-in)
- Report at lower of cost and net realizable value
- Write down obsolete or damaged items
- Count inventory at least once a year
`,
        },
        activity: {
          title: "Inventory Practice Bite",
          questions: [
            {
              prompt: "Which cost is included in the cost of inventory?",
              options: ["Freight-out to customers", "Freight-in from suppliers", "Sales commissions", "Advertising"],
              correctIdx: 1,
              explanation: "Costs to bring inventory to its saleable location and condition, like freight-in, are capitalized.",
            },
            {
              prompt: "In a period of rising prices, FIFO results in:",
              options: [
                "Higher COGS and lower ending inventory",
                "Lower COGS and higher ending inventory",
                "No difference from weighted average",
                "Lower net income",
              ],
              correctIdx: 1,
              explanation: "FIFO expenses the older, cheaper costs first, leaving newer, higher costs in inventory.",
            },
            {
              prompt: "Which method is NOT permitted under IFRS?",
              options: ["FIFO", "Weighted average", "LIFO", "Specific identification"],
              correctIdx: 2,
              explanation: "IFRS prohibits LIFO.",
            },
            {
              prompt: "Inventory is reported at the lower of:",
              options: [
                "Cost and selling price",
                "Cost and net realizable value",
                "Replacement cost and fair value",
                "Historical cost and market cap",
              ],
              correctIdx: 1,
              explanation: "If NRV falls below cost, inventory is written down to NRV.",
            },
            {
              prompt: "Beginning inventory 10,000 + purchases 40,000 - ending inventory 15,000. COGS is:",
              options: ["35,000", "45,000", "65,000", "25,000"],
              correctIdx: 0,
              explanation: "Goods available 50,000 minus ending inventory 15,000 = 35,000.",
            },
          ],
        },
        caseStudy: {
          title: "Inventory Case Study",
          content: `## Nacho Average Snack Shop

The shop bought tortilla chips in three batches this month:

| Batch | Units | Cost per unit |
|---|---|---|
| Day 1 | 100 | 2.00 |
| Day 10 | 100 | 2.20 |
| Day 20 | 100 | 2.50 |

It sold **180 units**.

### Work it through (FIFO)

- COGS: 100 x 2.00 + 80 x 2.20 = **376**
- Ending inventory: 20 x 2.20 + 100 x 2.50 = **294**

### Takeaway

The cost flow method changes both COGS on the income statement and inventory on the balance sheet, even though the chips are identical.
`,
        },
      },
      {
        slug: "prepaid-expenses",
        title: "Prepaid Expenses",
        illustration: "/illustrations/sushi.svg",
        lesson: {
          title: "All about Prepaid Expenses",
          content: `## What are prepaid expenses?

A prepaid expense is a payment made in advance for goods or services that will be used in future periods. Until the benefit is used, it is an asset.

## Adjusting prepaid expenses

At the end of each period, the used-up portion is moved from the asset to an expense with an adjusting entry.

### Common examples

- Prepaid rent
- Prepaid insurance
- Office supplies
- Prepaid subscriptions

### The adjusting entry

- Debit the expense (e.g. Rent Expense)
- Credit the prepaid asset
- Amount = portion used this period
- Remaining balance stays an asset
`,
        },
        activity: {
          title: "Prepaid Practice Bite",
          questions: [
            {
              prompt: "A company pays 12,000 for a one-year insurance policy on January 1. This is initially recorded as:",
              options: ["Insurance expense", "Prepaid insurance (asset)", "A liability", "Revenue"],
              correctIdx: 1,
              explanation: "The benefit has not been used yet, so it is an asset.",
            },
            {
              prompt: "Using the policy above, the balance of prepaid insurance on March 31 is:",
              options: ["12,000", "3,000", "9,000", "0"],
              correctIdx: 2,
              explanation: "3 months used (3,000), so 9 months or 9,000 remain.",
            },
            {
              prompt: "The adjusting entry for used prepaid rent is:",
              options: [
                "Debit Prepaid Rent, credit Cash",
                "Debit Rent Expense, credit Prepaid Rent",
                "Debit Cash, credit Rent Expense",
                "Debit Rent Payable, credit Prepaid Rent",
              ],
              correctIdx: 1,
              explanation: "The used portion moves from the asset to expense.",
            },
            {
              prompt: "If the prepaid adjustment is forgotten, the result is:",
              options: [
                "Assets understated, expenses overstated",
                "Assets overstated, expenses understated",
                "No effect",
                "Liabilities overstated",
              ],
              correctIdx: 1,
              explanation: "The asset still includes the used portion, and the expense is missing.",
            },
            {
              prompt: "Prepaid expenses are classified as current assets because:",
              options: [
                "They can be sold for cash",
                "They will be used up within a year",
                "They are paid in cash",
                "Auditors require it",
              ],
              correctIdx: 1,
              explanation: "They are consumed within the operating cycle, saving future cash outflows.",
            },
          ],
        },
        caseStudy: {
          title: "Prepaid Expenses Case Study",
          content: `## Sushi Roll Studio

On **October 1**, Sushi Roll Studio pays **6,000** for six months of rent in advance. Its year ends **December 31**.

### Work it through

- Oct 1: debit Prepaid Rent 6,000, credit Cash 6,000
- Monthly rent: 6,000 / 6 = 1,000
- Dec 31 adjustment: debit Rent Expense 3,000, credit Prepaid Rent 3,000
- Balance sheet: Prepaid Rent **3,000** (January to March)

### Takeaway

Prepaid expenses turn into expenses as time passes. Adjusting entries keep both the balance sheet and income statement accurate.
`,
        },
      },
    ],
  },
  {
    slug: "non-current",
    title: "Non-current ASSETizers",
    description: "Long-term assets that provide benefits for more than one year.",
    topics: [
      {
        slug: "property-plant-equipment",
        title: "Property, Plant and Equipment",
        illustration: "/illustrations/bento.svg",
        lesson: {
          title: "All about Property, Plant and Equipment",
          content: `## What is PPE?

Property, plant and equipment are tangible assets used in operations for more than one year: land, buildings, machinery, vehicles, furniture and similar items.

## Cost and depreciation

PPE is recorded at cost, which includes everything needed to get the asset ready for use. Except for land, its cost is spread over its useful life through **depreciation**.

### Included in cost

- Purchase price and import duties
- Delivery and installation
- Testing before use
- Site preparation

### Depreciation methods

- Straight-line
- Declining balance
- Units of production
- Land is not depreciated
`,
        },
        activity: {
          title: "PPE Practice Bite",
          questions: [
            {
              prompt: "Which asset is NOT depreciated?",
              options: ["Building", "Delivery truck", "Land", "Machinery"],
              correctIdx: 2,
              explanation: "Land has an indefinite useful life, so it is not depreciated.",
            },
            {
              prompt: "Machine cost 50,000, residual value 5,000, useful life 5 years. Straight-line depreciation per year is:",
              options: ["10,000", "9,000", "11,000", "5,000"],
              correctIdx: 1,
              explanation: "(50,000 - 5,000) / 5 = 9,000.",
            },
            {
              prompt: "Which cost is capitalized as part of equipment?",
              options: ["Routine repairs", "Installation costs", "Annual insurance", "Operator training after use begins"],
              correctIdx: 1,
              explanation: "Costs to get the asset ready for its intended use are capitalized.",
            },
            {
              prompt: "Accumulated depreciation is:",
              options: ["An expense", "A liability", "A contra-asset", "Equity"],
              correctIdx: 2,
              explanation: "It reduces the carrying amount of PPE on the balance sheet.",
            },
            {
              prompt: "Carrying amount (book value) equals:",
              options: [
                "Market value",
                "Cost minus accumulated depreciation",
                "Cost plus residual value",
                "Depreciation expense to date",
              ],
              correctIdx: 1,
              explanation: "Book value is historical cost less accumulated depreciation (and impairment).",
            },
          ],
        },
        caseStudy: {
          title: "Property, Plant and Equipment Case Study",
          content: `## Bento Box Kitchen

Bento Box Kitchen buys a commercial oven:

| Item | Amount |
|---|---|
| Purchase price | 40,000 |
| Delivery | 1,500 |
| Installation | 2,500 |
| First-year maintenance plan | 1,200 |

Useful life: **8 years**, residual value: **4,000**.

### Work it through

- Capitalized cost: 40,000 + 1,500 + 2,500 = **44,000** (the maintenance plan is expensed)
- Annual straight-line depreciation: (44,000 - 4,000) / 8 = **5,000**
- Book value after 3 years: 44,000 - 15,000 = **29,000**

### Takeaway

Capitalize what it takes to get the asset working; expense what it takes to keep it working.
`,
        },
      },
      {
        slug: "intangible-assets",
        title: "Intangible Assets",
        illustration: "/illustrations/dumpling.svg",
        lesson: {
          title: "All about Intangible Assets",
          content: `## What are intangibles?

Intangible assets are identifiable non-monetary assets without physical substance, such as patents, trademarks, copyrights, licenses and software.

## Amortization and impairment

Intangibles with a finite life are **amortized** over that life. Those with an indefinite life, like goodwill, are not amortized but tested for **impairment** at least annually.

### Examples

- Patents and copyrights
- Trademarks and brand names
- Franchise licenses
- Purchased software

### Key rules

- Internally generated goodwill is never recognized
- Research costs are expensed
- Some development costs may be capitalized
- Goodwill arises only from acquisitions
`,
        },
        activity: {
          title: "Intangibles Practice Bite",
          questions: [
            {
              prompt: "Which is an intangible asset?",
              options: ["Delivery van", "Patent", "Inventory", "Land"],
              correctIdx: 1,
              explanation: "A patent has no physical substance but provides future benefits.",
            },
            {
              prompt: "Goodwill is:",
              options: [
                "Amortized over 10 years",
                "Tested for impairment, not amortized",
                "Expensed immediately",
                "Recognized when built internally",
              ],
              correctIdx: 1,
              explanation: "Goodwill has an indefinite life and is tested for impairment at least annually.",
            },
            {
              prompt: "Research costs are:",
              options: ["Capitalized", "Expensed as incurred", "Recorded as goodwill", "Deferred revenue"],
              correctIdx: 1,
              explanation: "Research costs are expensed because future benefits are uncertain.",
            },
            {
              prompt: "A license costing 30,000 with a 5-year life is amortized at:",
              options: ["30,000 per year", "6,000 per year", "5,000 per year", "Not amortized"],
              correctIdx: 1,
              explanation: "30,000 / 5 = 6,000 per year (straight-line).",
            },
            {
              prompt: "Goodwill arises when:",
              options: [
                "A company advertises heavily",
                "A company buys another for more than the fair value of its net assets",
                "Employees are well trained",
                "A brand becomes popular",
              ],
              correctIdx: 1,
              explanation: "Only purchased goodwill from a business combination is recognized.",
            },
          ],
        },
        caseStudy: {
          title: "Intangible Assets Case Study",
          content: `## Dumpling Dynasty

Dumpling Dynasty buys a regional dumpling chain for **900,000**. The fair value of the chain's identifiable net assets is **750,000**, including a recipe trademark valued at **60,000** with a 10-year life.

### Work it through

- Goodwill: 900,000 - 750,000 = **150,000**, tested yearly for impairment
- Trademark amortization: 60,000 / 10 = **6,000 per year**

### Takeaway

Pay more than the parts are worth and the difference becomes goodwill. Identifiable intangibles with a finite life are amortized like PPE is depreciated.
`,
        },
      },
      {
        slug: "long-term-investments",
        title: "Long-term Investments",
        illustration: "/illustrations/mints.svg",
        lesson: {
          title: "All about Long-term Investments",
          content: `## What are long-term investments?

Long-term investments are holdings a company intends to keep for more than one year, such as bonds held to maturity, shares in other companies, and investment property.

## Classification drives measurement

How an investment is measured depends on what it is and why it is held.

### Common types

- Bonds held to maturity
- Equity shares in other companies
- Investments in associates
- Investment property

### Measurement bases

- Amortized cost
- Fair value through profit or loss
- Fair value through other comprehensive income
- Equity method (significant influence)
`,
        },
        activity: {
          title: "Investments Practice Bite",
          questions: [
            {
              prompt: "An investment is classified as long-term when:",
              options: [
                "It cost more than 10,000",
                "It is intended to be held for more than one year",
                "It is in a foreign currency",
                "It pays dividends",
              ],
              correctIdx: 1,
              explanation: "Intent and ability to hold beyond one year makes it non-current.",
            },
            {
              prompt: "Bonds held to collect contractual cash flows are usually measured at:",
              options: ["Amortized cost", "Replacement cost", "Net realizable value", "Selling price"],
              correctIdx: 0,
              explanation: "A hold-to-collect business model leads to amortized cost.",
            },
            {
              prompt: "The equity method is used when the investor has:",
              options: ["No influence", "Significant influence", "Full control", "Only bonds"],
              correctIdx: 1,
              explanation: "Significant influence (often 20 to 50% ownership) leads to the equity method.",
            },
            {
              prompt: "A building held to earn rent rather than for operations is:",
              options: ["Inventory", "PPE", "Investment property", "Prepaid rent"],
              correctIdx: 2,
              explanation: "Property held for rental income or capital appreciation is investment property.",
            },
            {
              prompt: "Under the equity method, the investor's share of the investee's profit:",
              options: [
                "Is ignored",
                "Increases the investment account",
                "Decreases the investment account",
                "Is recorded only when cash is received",
              ],
              correctIdx: 1,
              explanation: "The investment grows by the investor's share of profit; dividends reduce it.",
            },
          ],
        },
        caseStudy: {
          title: "Long-term Investments Case Study",
          content: `## Mint Condition Holdings

Mint Condition Holdings buys **25%** of Peppermint Co. for **200,000**, giving it significant influence. During the year Peppermint Co. earns **80,000** and pays **20,000** in dividends.

### Work it through (equity method)

- Share of profit: 25% x 80,000 = **20,000** (increase investment)
- Share of dividends: 25% x 20,000 = **5,000** (decrease investment)
- Year-end investment: 200,000 + 20,000 - 5,000 = **215,000**

### Takeaway

With significant influence, the investment tracks the investee's results, not just the cash received.
`,
        },
      },
    ],
  },
];
