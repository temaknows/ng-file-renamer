const util = require("util");
const exec = util.promisify(require("child_process").exec);

class Executor {
  async run(from, to) {}
}

class RenameFileExecutor extends Executor {
  async run(from, to) {
    try {
      const { stderr } = await exec(
        `for file in *.component.* ; do mv $file \${file//${from}/${to}} ; done`
      );

      if (stderr) {
        throw new Error(stderr);
      }
      console.log(`${from}.component.* -> ${to}.component.*`);
    } catch (e) {
      throw e;
    }
  }
}

class UpdateMetaExecutor extends Executor {
  async run(from, to) {
    try {
      const { stderr } = await exec(
        `sed -i -e 's/${from}/${to}/g' ${to}.component.ts`
      );
      if (stderr) {
        throw new Error(stderr);
      }
      console.log(`${to}.component.ts cahnged successfully`);
    } catch (e) {
      throw e;
    }
  }
}

class App {
  #from;
  #to;

  #renameFileExecutor;
  #updateMetaExecutor;
  constructor(renameFileExecutor, updateMetaExecutor) {
    const args = process.argv.slice(2);

    if (args.length < 2) {
      console.warn("Wrong list params");
      process.exit(1);
    }

    this.#from = args[0];
    this.#to = args[1];

    this.#renameFileExecutor = renameFileExecutor;
    this.#updateMetaExecutor = updateMetaExecutor;
  }

  async run() {
    try {
      await this.#renameFileExecutor.run(this.#from, this.#to);
      await this.#updateMetaExecutor.run(this.#from, this.#to);
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  }
}

const app = new App(new RenameFileExecutor(), new UpdateMetaExecutor());

app.run();
