---
id: 1300
title: Tracebacks in bash
date: 2013-06-29T09:05:33-04:00
author: docwhat
layout: post
guid: https://docwhat.org/?p=1300
permalink: /tracebacks-in-bash/
openid_comments:
  - 'a:1:{i:0;i:9945;}'
image: /files/2013/06/argonaut_shell-250x187.jpg
categories:
  - docwhat
tags:
  - bash
  - programming
---
I don't like to write programs in
[`bash`](https://en.wikipedia.org/wiki/Bash_(Unix_shell)). It's not a
very pretty language. But it has one advantage over a lot of other
languages:

It's on your system. Every Unix-like system has `/bin/bash`; Redhat,
Ubuntu, and even OS X.

But bash is still a lousy language.

This is where bash tracebacks come in...

*"Whaaaaa? Bash has tracebacks?"* I can hear you ask.

Yup, it can.

Check out the gist below. It is both a demonstration of the traceback as
well as a template; grab the bits between the "cut here" and paste it
into your own program.

``` bash
#!/bin/bash
#
# Tracebacks in bash
# https://docwhat.org/tracebacks-in-bash/
#
# Just take the code between the "cut here" lines
# and put it in your own program.
#
# Written by Christian Höltje
# Donated to the public domain in 2013

#--------->8---------cut here---------8<---------
set -eu

trap _exit_trap EXIT
trap _err_trap ERR
_showed_traceback=f

function _exit_trap
{
  local _ec="$?"
  if [[ $_ec != 0 && "${_showed_traceback}" != t ]]; then
    traceback 1
  fi
}

function _err_trap
{
  local _ec="$?"
  local _cmd="${BASH_COMMAND:-unknown}"
  traceback 1
  _showed_traceback=t
  echo "The command ${_cmd} exited with exit code ${_ec}." 1>&2
}

function traceback
{
  # Hide the traceback() call.
  local -i start=$(( ${1:-0} + 1 ))
  local -i end=${#BASH_SOURCE[@]}
  local -i i=0
  local -i j=0

  echo "Traceback (last called is first):" 1>&2
  for ((i=${start}; i < ${end}; i++)); do
    j=$(( $i - 1 ))
    local function="${FUNCNAME[$i]}"
    local file="${BASH_SOURCE[$i]}"
    local line="${BASH_LINENO[$j]}"
    echo "     ${function}() in ${file}:${line}" 1>&2
  done
}
#--------->8---------cut here---------8<---------

########
## Demos

function bomb
{
  trap _err_trap ERR
  local limit=${1:-5}
  echo -n " ${limit}"
  if [ "${limit}" -le 0 ]; then
    echo " BOOM"
    return 10
  else
    bomb $(( ${limit} - 1 ))
  fi
}

function stack
{
  stack_1
}
function stack_1
{
  stack_2
}
function stack_2
{
  stack_3
}
function stack_3
{
  no_such_function
}

#######
## Main

case "${1:-}" in
  stack)
    stack;;
  bomb)
    echo -n "Counting down..."; bomb ;;
  badvar)
    echo "This shouldn't be shown because ${bad_variable} isn't set";;
  false)
    false;;
  true)
    true;;
  *)
    echo "Usage: $0 [bomb|badvar|true|false|stack]"
    ;;
esac

# EOF
```

The gist (pun intended) of it that it traps `ERR` and `EXIT` interrupts
in the shell. It then walks the `FUNCNAME`, `BASH_SOURCE`, and
`BASH_LINENO` arrays to show where the callers were.

There is a little extra bits to ensure the traceback function itself
doesn't appear in the output and to format it nicely.

Not only are the tracebacks useful, but they make using `set -eu` much
less painful. And you *are* using `set -eu` in your bash programs,
right? *Right?*

I hope it is useful. If you have suggestions or questions, just ask!

Ciao!
