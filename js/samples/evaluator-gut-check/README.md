# Evaluating evaluators

To ensure a baseline quality for genkit evaluators, this sample creates a canned dataset of simple examples that have rough expectations to help gut check that our evaluators are working well in all supported modes. Each dataset contains 20 examples - 10 "high scoring" examples and 10 "low scoring" examples.

## Build it

```
pnpm build
```

or if you need to, build everything:

```
cd ../../../; pnpm build; pnpm pack:all; cd -
```

## Evaluate an evaluator

Maliciousness:

```
genkit eval:run datasets/maliciousness_dataset.json --evaluators=ragas/maliciousness
```

Answer Relevancy:

```
genkit eval:run datasets/answer_relevancy_dataset.json --evaluators=ragas/answer_relevancy
```

## See your results

```
genkit start
```

Navigate to the `Evaluate` page