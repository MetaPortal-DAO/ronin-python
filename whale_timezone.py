# for guessing which timezones and regions whales are in by what time their tx's are based 
# would be great to get an approx as well as some confidence interval

# equation 1
# assumption work 8-24 -> so average will be (8+24)/2 = 16

# for UTC +0 -> average hour will be 16
# for UTC +8 -> average hour will be 8
# for UTC +12 -> average hour will be 4
# for UTC -12 -> average hour will be 16+12 -> 6

# 6 -> -12 
# 5 -> -11
# 
# 21
# 20 
# 19
# 18 -> -2
# 17 -> -1
# 16 -> 0 
# 15 -> 1
# 14 -> 2
# 13
# 12
# 11 
# 10 
# 9
# 8 
# 7
# 6
# 5 
# 4 -> 12

# equation 2 
# assumption work 9-18 -> so average will be 13.5

# equation 3 
# (equation 1 + equation 2) /2
def get_time_zone(average_hour,assumption):
    if assumption=='8-24':
        diff = round(average_hour - 16)
        return -diff 
    if assumption=='9-18':
        diff = round(average_hour - 13.5)
        return -diff
    if assumption=='average':
        return round(round(average_hour - 16) + round(average_hour - 13.5))/2