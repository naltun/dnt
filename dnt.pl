#!/usr/bin/env perl
package Dnt;

use 5.030;
use strict;
use warnings;

use Getopt::Std;
use lib './lib/';
use Dnt::Head;

our $VERSION = '0.1.0';

sub usage {
    my ($exitcode) = @_;
    say "Usage: $0 [ global options ] <command> [ options ] <host>

DESCRIPTION
  dnt (v$VERSION) is a collection of lightweight networking utilities.
  See COMMANDS for supported features.

COMMANDS:
  * head

GLOBAL OPTIONS
  -h       Print this help message
  -v       Print dnt version

Tip: use -h with each command to learn more, e.g. `$0 head -h')";
    exit $exitcode;
}

sub version {
    say "$0 v$VERSION";
}

sub main {
    my ( $cmd, $host ) = @ARGV;
    my $commands = { head => 'Dnt::Head' };

    # examples:
    #   dnt.pl head https://www.perl.org
    #   dnt.pl -h
    # process ARGV[0]
    if    ( !defined $cmd ) { usage 1; }
    elsif ( $cmd eq '-h' )  { usage 0; }
    elsif ( $cmd eq '-v' )  { version && exit 0; }

    # process ARGV[1]
    elsif ( !defined $host ) { $commands->{$cmd}->help    && exit 1; }
    elsif ( $host eq '-h' )  { $commands->{$cmd}->help    && exit 0; }
    elsif ( $host eq '-v' )  { $commands->{$cmd}->version && exit 0; }

    $commands->{$cmd}->exec($host);
}

main();
