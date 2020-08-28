# scheduler


### How to create a rule ?

- If you want to create a weekly rule

```
post at api/rules
{
	"is_weekly": true,
	"week_days": ["Mon", "Tue", "Thu"],
	"interval": [{"start": "{start_hour}", "end": "{end_hour}"}]
}
```

- If you want to create a daily rule

```
post at api/rules
{
	"is_weekly": true,
	"interval": [{"start": "{start_hour}", "end": "{end_hour}"}]
}
```

- If you want to create a specific rule

```
post at api/rules
{
	"day": "{wanted date}"
	"interval": [{"start": "{start_hour}", "end": "{end_hour}"}]
}
```

- If you want to see all rules

```
get at api/rules
{
	"day": "{wanted date}"
	"interval": [{"start": "{start_hour}", "end": "{end_hour}"}]
}
```


- If you want to remove rules

```
get at api/rules/remove?id={rule_id}

```

- If you want to see the opening hours

```
get at /api/rules/available?sd={start_date}&ed={end_date}
```


