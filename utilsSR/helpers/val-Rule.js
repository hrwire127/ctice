class valRule
{
    constructor(value, expected, rule)
    {
        this.value = value;
        this.expected = expected;
        this.rule = rule;
    }
    getVal()
    {
        const { value, expected, rule } = this;
        switch (rule)
        {
            case 0:
                return value > expected;
            case 1:
                return value < expected
            case 2:
                return value === expected
            case 3:
                return value !== expected
            case 4:
                return !value.toString().includes(expected)
            case 5:
                return !expected.toString().includes(value)
        }
    }
    processMsg()
    {
        let sign;
        if (this.rule === 0) sign = "greater"
        if (this.rule === 1) sign = "smaller"
        if (this.rule === 2) sign = "equal"
        if (this.rule === 3) sign = "different"
        if (this.rule === 4) sign = "unmatched"
        return `The value ${this.value} is ${sign} than ${this.expected} expected value`
    }
}

module.exports = { valRule };