class excRule
{
    constructor(regulars, irregulars, func, optional = false)
    {
        this.regulars = regulars;
        this.irregulars = irregulars;
        this.func = func;
        this.optional = optional
    }
    async Try()
    {
        let v = true;
        if(this.optional) 
        {
            await this.func()
            return true
        }
        this.regulars.forEach(e => {
            if (!e)
            {
                v = false
                return;
            }
        });
        this.irregulars.forEach(e => 
        {
            if (e)
            {
                v = false
                return;
            }
        });
        console.log(v)
        if(v)
        {
            await this.func()
            return true
        }
        else
        {
            return false
        }
    }
}

module.exports = {
    excRule
}