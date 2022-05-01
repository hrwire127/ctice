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

const Rules = {
    title_max_char: 20,
    desc_max_blocks: 30,
    file_max_size: 1000000,
    file_format: 'application/pdf',
    file_max_width: 1000,
    file_max_height: 1000,
    file_min_width: 200,
    file_min_height: 200,
    username_max_char: 10,
    password_max_char: 10,
    email_max_char: 40,
    email_includes: "@",
    file_max_name: 20,
    comment_max_blocks: 10,
}

module.exports = { valRule, Rules };