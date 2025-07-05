package com.dreamchasers.recoverbe.enums;

import lombok.Getter;

@Getter
public enum CoursePrice {
    FREE(0), TIER1 (399000), TIER2(499000), TIER3 (599000),
    TIER4(699000), TIER5(799000), TIER6 (899000),
    TIER7(999000), TIER8(1099000), TIER9 (1199000),
    TIER10(1299000), TIER11(1399000), TIER13 (1499000),
    TIER14(1599000), TIER15(1699000), TIER16 (1799000);

    private final int price;

    CoursePrice(int price) {
        this.price = price;
    }

    public int getPrice() {
        return price;
    }

    public static CoursePrice fromInt(int price) {

        for (CoursePrice coursePrice : CoursePrice.values()) {
            if (coursePrice.price == price) {
                return coursePrice;
            }
        }
        return null;
    }
}
