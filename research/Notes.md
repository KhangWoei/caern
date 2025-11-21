# Defaults
JavaScript/TypeScript evaluates defaults at call-time, creating new objects each time, meaning it allows non-compile time constants to be used as defaults unlike C#/.NET, and unlike python because it evaluates defaults at call-time it doesn't (while it can) run into the issue with all default values pointing to the same reference.

## Partial defaults
Allows users to only override what they need.

```
    constructor(defaultParameter: Partial<DefaultParameter> = { })
    {
        this._defaultParameter = { ...DEFAULT_PARAMETER, ...defaultParameter);
    }
```
