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
        if (this.rule === 0) sign = "too big"
        if (this.rule === 1) sign = "too small"
        if (this.rule === 2) sign = "not equal"
        if (this.rule === 3) sign = "not different"
        if (this.rule === 4) sign = "invalid"
        return `${this.value} is ${sign}, expected ${this.expected}`
    }
}

module.exports = { valRule };