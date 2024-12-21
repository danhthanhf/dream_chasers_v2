package com.dreamchasers.recoverbe.service;

import com.dreamchasers.recoverbe.dto.StatisticAllDTO;
import com.dreamchasers.recoverbe.dto.StatisticDTO;
import com.dreamchasers.recoverbe.entity.CourseKit.QCourse;
import com.dreamchasers.recoverbe.entity.User.QInvoice;
import com.dreamchasers.recoverbe.entity.User.QUser;
import com.dreamchasers.recoverbe.entity.post.QPost;
import com.dreamchasers.recoverbe.enums.CoursePostStatus;
import com.dreamchasers.recoverbe.helper.component.ResponseObject;
import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StatisticService {
    private final JPAQueryFactory queryFactory;

    public StatisticDTO getStatisticPostByPeriod(String period) {
        QPost post = QPost.post;
        List<Tuple> result;
        if ("year".equalsIgnoreCase(period)) {
            result = queryFactory.select(post.createdAt.year(), post.id.count())
                    .from(post)
                    .where(post.deleted.eq(false).and(post.createdAt.year().eq(LocalDateTime.now().getYear())))
                    .groupBy(post.createdAt.year())
                    .fetch();
        } else if ("month".equalsIgnoreCase(period)) {
            result = queryFactory.select(post.createdAt.month(), post.id.count())
                    .from(post)
                    .where(post.deleted.eq(false)
                            .and(post.createdAt.year().eq(LocalDateTime.now().getYear()))
                            .and(post.createdAt.month().eq(LocalDateTime.now().getMonthValue())))
                    .groupBy(post.createdAt.month())
                    .fetch();
        } else if ("day".equalsIgnoreCase(period)) {
            result = queryFactory.select(post.createdAt.dayOfMonth(), post.id.count())
                    .from(post)
                    .where(post.deleted.eq(false)
                            .and(post.createdAt.year().eq(LocalDateTime.now().getYear()))
                            .and(post.createdAt.month().eq(LocalDateTime.now().getMonthValue()))
                            .and(post.createdAt.dayOfMonth().eq(LocalDateTime.now().getDayOfMonth())))
                    .groupBy(post.createdAt.dayOfMonth())
                    .fetch();
        } else {
            throw new IllegalArgumentException("Invalid period or missing parameters");
        }

        Map<Integer, Long> statistic = result.stream()
                .collect(Collectors.toMap(
                        tuple -> tuple.get(0, Integer.class),
                        tuple -> tuple.get(1, Long.class)
                ));
        return StatisticDTO.builder().data(statistic).build();
    }

    public StatisticDTO getStatisticCourseByPeriod(String period) {
        QCourse course = QCourse.course;
        List<Tuple> result;
        if ("year".equalsIgnoreCase(period)) {
            result = queryFactory.select(course.createdAt.year(), course.id.count())
                    .from(course)
                    .where(course.deleted.eq(false).and(course.status.eq(CoursePostStatus.PUBLISHED)).and(course.createdAt.year().eq(LocalDateTime.now().getYear())))
                    .groupBy(course.createdAt.year())
                    .fetch();
        } else if ("month".equalsIgnoreCase(period)) {
            result = queryFactory.select(course.createdAt.month(), course.id.count())
                    .from(course)
                    .where(course.deleted.eq(false).and(course.status.eq(CoursePostStatus.PUBLISHED))
                            .and(course.createdAt.year().eq(LocalDateTime.now().getYear())))
                    .groupBy(course.createdAt.month())
                    .fetch();
        } else if ("day".equalsIgnoreCase(period)) {
            result = queryFactory.select(course.createdAt.dayOfMonth(), course.id.count())
                    .from(course)
                    .where(course.deleted.eq(false).and(course.status.eq(CoursePostStatus.PUBLISHED))
                            .and(course.createdAt.year().eq(LocalDateTime.now().getYear()))
                            .and(course.createdAt.month().eq(LocalDateTime.now().getMonthValue())))
                    .groupBy(course.createdAt.dayOfMonth())
                    .fetch();
        } else {
            throw new IllegalArgumentException("Invalid period or missing parameters");
        }

        Map<Integer, Long> statistic = result.stream()
                .collect(Collectors.toMap(
                        tuple -> tuple.get(0, Integer.class),
                        tuple -> tuple.get(1, Long.class)
                ));
        return StatisticDTO.builder().data(statistic).build();
    }

    public StatisticDTO getStatisticUserByPeriod(String period) {
        QUser entity = QUser.user;
        List<Tuple> result;
        if ("year".equalsIgnoreCase(period)) {
            result = queryFactory.select(entity.createdAt.year(), entity.id.count())
                    .from(entity)
                    .where(entity.deleted.eq(false))
                    .groupBy(entity.createdAt.year())
                    .fetch();
        } else if ("month".equalsIgnoreCase(period)) {
            result = queryFactory.select(entity.createdAt.month(), entity.id.count())
                    .from(entity)
                    .where(entity.deleted.eq(false)
                            .and(entity.createdAt.year().eq(LocalDateTime.now().getYear())))
                    .groupBy(entity.createdAt.month())
                    .fetch();
        } else if ("day".equalsIgnoreCase(period)) {
            result = queryFactory.select(entity.createdAt.dayOfMonth(), entity.id.count())
                    .from(entity)
                    .where(entity.deleted.eq(false)
                            .and(entity.createdAt.year().eq(LocalDateTime.now().getYear()))
                            .and(entity.createdAt.month().eq(LocalDateTime.now().getMonthValue())))
                    .groupBy(entity.createdAt.dayOfMonth())
                    .fetch();
        } else {
            throw new IllegalArgumentException("Invalid period or missing parameters");
        }

        Map<Integer, Long> statistic = result.stream()
                .collect(Collectors.toMap(
                        tuple -> tuple.get(0, Integer.class),
                        tuple -> tuple.get(1, Long.class)
                ));
        return StatisticDTO.builder().data(statistic).build();
    }

    public StatisticDTO getStatisticInvoiceByPeriod(String period) {
        QInvoice entity = QInvoice.invoice;

        List<Tuple> result;
        if ("year".equalsIgnoreCase(period)) {
            result = queryFactory.select(entity.createdAt.year(), entity.total.sum())
                    .from(entity)
                    .where(entity.deleted.eq(false))
                    .groupBy(entity.createdAt.year())
                    .fetch();
        } else if ("month".equalsIgnoreCase(period)) {
            result = queryFactory.select(entity.createdAt.month(), entity.total.sum())
                    .from(entity)
                    .where(entity.deleted.eq(false)
                            .and(entity.createdAt.year().eq(LocalDateTime.now().getYear())))
                    .groupBy(entity.createdAt.month())
                    .fetch();
        } else if ("day".equalsIgnoreCase(period)) {
            result = queryFactory.select(entity.createdAt.dayOfMonth(), entity.total.sum())
                    .from(entity)
                    .where(entity.deleted.eq(false)
                            .and(entity.createdAt.year().eq(LocalDateTime.now().getYear()))
                            .and(entity.createdAt.month().eq(LocalDateTime.now().getMonthValue()))
                            .and(entity.createdAt.dayOfMonth().eq(LocalDateTime.now().getDayOfMonth())))
                    .groupBy(entity.createdAt.dayOfMonth())
                    .fetch();
        } else {
            throw new IllegalArgumentException("Invalid period or missing parameters");
        }

        Map<Integer, Long> statistic = result.stream()
                .collect(Collectors.toMap(
                        tuple -> tuple.get(0, Integer.class),
                        tuple -> tuple.get(1, Long.class)
                ));

        return StatisticDTO.builder().data(statistic).build();
    }

    public ResponseObject getStatisticByDateTimeAndType(String type, String dateTime) {

        if(type.equalsIgnoreCase("course")) {
            StatisticDTO statisticCourse = getStatisticCourseByPeriod(dateTime.toLowerCase());
            return ResponseObject.builder().status(HttpStatus.OK).content(statisticCourse).build();
        } else if(type.equalsIgnoreCase("post")) {
            StatisticDTO statisticPost = getStatisticPostByPeriod(dateTime.toLowerCase());
            return ResponseObject.builder().status(HttpStatus.OK).content(statisticPost).build();
        } else if(type.equalsIgnoreCase("user")) {
            StatisticDTO statisticUser = getStatisticUserByPeriod(dateTime.toLowerCase());
            return ResponseObject.builder().status(HttpStatus.OK).content(statisticUser).build();
        } else if(type.equalsIgnoreCase("balance")) {
            StatisticDTO statisticInvoice = getStatisticInvoiceByPeriod(dateTime.toLowerCase());
            return ResponseObject.builder().status(HttpStatus.OK).content(statisticInvoice).build();
        } else {
            throw new IllegalArgumentException("Invalid type");
        }
    }

    public ResponseObject getStatistic() {
        QUser user = QUser.user;
        QPost post = QPost.post;
        QCourse course = QCourse.course;
        QInvoice invoice = QInvoice.invoice;

        Long totalCourseResult = queryFactory.select(course.count())
                .from(course)
                .where(course.deleted.eq(false))
                .fetchOne();
        long totalCourse = (totalCourseResult != null) ? totalCourseResult : 0L;

        Long totalUserResult = queryFactory.select(user.count())
                .from(user)
                .where(user.deleted.eq(false))
                .fetchOne();
        long totalUser = (totalUserResult != null) ? totalUserResult : 0L;


        Long totalPostResult = queryFactory.select(post.count())
                .from(post)
                .where(post.deleted.eq(false).and(post.status.eq(CoursePostStatus.PUBLISHED)))
                .fetchOne();

        long totalPost = (totalPostResult != null) ? totalPostResult : 0L;

        Long totalBalanceResult = queryFactory.select(invoice.total.sum())
                .from(invoice)
                .fetchOne();

        long totalBalance = (totalBalanceResult != null) ? totalBalanceResult : 0L;


        StatisticDTO statisticCourse = getStatisticCourseByPeriod("year");
        StatisticDTO statisticPost = getStatisticPostByPeriod("year");
        StatisticDTO statisticUser = getStatisticUserByPeriod("year");
        StatisticDTO statisticInvoice = getStatisticInvoiceByPeriod("year");

        StatisticAllDTO all = StatisticAllDTO.builder()
                .totalCourse(totalCourse)
                .totalUser(totalUser)
                .totalPost(totalPost)
                .totalBalance(totalBalance)
                .course(statisticCourse)
                .user(statisticUser)
                .balance(statisticInvoice)
                .post(statisticPost)
                .build();

        return ResponseObject.builder().status(HttpStatus.OK).content(all).build();
    }


}
