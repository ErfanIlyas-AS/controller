#!/bin/bash


echo "cpu_usage:$(cat /proc/loadavg)"

echo "**CMDSEPERATOR**"

echo "cpu_cores:$(getconf _NPROCESSORS_ONLN)"

echo "**CMDSEPERATOR**"

echo "memory_used:$(free | awk '/^Mem/ {print $3}')"

echo "**CMDSEPERATOR**"

echo "memory_total:$(free | awk '/^Mem/ {print $2}')"

echo "**CMDSEPERATOR**"

echo "disk_used:$(df -h / | awk 'NR==2 {print $3}')"

echo "**CMDSEPERATOR**"

echo "disk_total:$(df -h / | awk 'NR==2 {print $2}')"

echo "**CMDSEPERATOR**"

echo "bandwidth_this_monht:$(vnstat -i eth0 --json m 1)"