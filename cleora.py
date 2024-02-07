import subprocess


class CleoraExecutor:

    def __init__(self, dimensions=32, iter=16):
        self.dimensions = dimensions
        self.iterations = iter
        self.columns = ["user", "anime"]
        self.tsv_filename = "data3.tsv"

    def cleora_exe(self, cleora_exe="cleora"):

        command = [cleora_exe,
                   "--type", "tsv",
                   f"--columns={self.columns[0]} complex::reflexive::{self.columns[1]}",
                   "--dimension", str(self.dimensions),
                   "--number-of-iterations", str(self.iterations),
                   "--prepend-field-name", "1",
                   "-f", "numpy",
                   "-o", "results",
                   "-e", "0",
                   self.tsv_filename]
        subprocess.run(command, check=True, stderr=subprocess.DEVNULL)


if __name__ == "__main__":
    m = CleoraExecutor()
    m.cleora_exe()
