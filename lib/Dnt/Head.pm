package Dnt::Head;

use 5.030;
use strict;
use warnings;

use LWP::Simple  qw(head);
use String::Util qw(startswith);

my $VERSION = '0.1.0';

sub exec {
    my ( $class, $url ) = @_;

    if ( !startswith( $url, "http://" ) && !startswith( $url, "https://" ) ) {
        $url =~ s/^/https:\/\//;
    }

    my $response = head($url);
    if ( defined $response && $response->is_success ) {
        my $headers = $response->{_headers}->as_string;
        $headers =~ s/Client-.*//g;
        $headers =~ s/\s+$//;
        say $headers;
    }
}

sub help {
    say "Usage: dnt head [-hv] [http[s]://]<host>

DESCRIPTION
  dnt-head (v$VERSION) is an HTTP client for retrieving web server headers.

OPTIONS
  -h       Print this help message
  -v       Print dnt-head version"
}

sub version {
    say "$0 v$VERSION";
}
