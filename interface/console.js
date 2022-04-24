module.exports = class consoleInterface {
constructor(prompt = "~\\ (y/n)? ", {prompt = "~\\ (y/n)? ",}) {
    this.data = {}
    this.data.prompt = prompt
    this.#awake = true;

}
setPrompt(prompt = "~\\ (y/n)? ", {prompt = "~\\ (y/n)? "}) {
    if (!this.#awake) return;
    this.data.prompt = prompt;
}
async createInterface() {
    if (!this.#awake) return;
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const response = await rl.question(this.data.prompt)
    return response.then(response => {return response})
    this.#destroy();
}
#destroy() {
    this.#awake = false;
}
}