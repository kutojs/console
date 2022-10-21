var term = require("terminal-kit").terminal;
/**
 * @param {String} string
 * @param {String} command
 */
module.exports = async function (string, command) {
  console.clear();

  var exec = string;
  if (string.startsWith(" ")) exec = exec.substring(1);
  exec = exec.split("*.NEWLINE.*").join("\n");

  term(exec);

  term.brightYellow("\n\nDo you want this script to run? ").gray("[y/n]\n");
  term.yesOrNo(
    {
      echoNo: false,
      echoYes: false,

      yes: ["y", "yes"],
      no: ["n", "no"],
    },
    async function (err, res) {
      if (err) {
        return term.brightRed("\nError when user input");
      }

      async function awaitCommand() {
        require("./index").awaitCommand();
      }

      if (res) {
        console.clear();
        require("./index").home(command, "", true);

        try {
          var yes = false;
          var intv = setInterval(async function () {
            if (yes == true) return clearInterval(intv);

            if (require("./index").sessionStorage.readyForEval == true) {
              if (exec.includes("awaitCommand()")) {
                yes = true;
                clearInterval(intv);

                await eval(exec);
              } else {
                yes = true;
                clearInterval(intv);

                await eval(exec);

                awaitCommand();
              }
            }
          }, 100);
        } catch (err1) {
          term.brightRed("\nError at executing script");
          return console.error(err1);
        }
      } else {
        console.clear();
        require("./index").home(command, "User denied\n", false);
      }
    }
  );
};
