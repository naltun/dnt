# dnt (D networking tools)

`dnt` is a collection of lightweight networking utilities. The collection currently includes:
* head

These tools will be helpful when administrating networks, developing web applications,
and conducting penetration tests.

# Install and Run

Ensure Perl is installed along with [cpanm](https://metacpan.org/pod/App::cpanminus) and run:
```sh
cpanm --installdeps vendor/*
```

To run `dnt`:
```sh
perl dnt/dnt.pl -h
```

You can also update `$PATH`:
```sh
export PATH=path/to/dnt:${PATH}
```

# LICENSE

Mozilla Public License, version 2.0
