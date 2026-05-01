package com.sfs.educonnect.repository;

import com.sfs.educonnect.entity.Faq;
import com.sfs.educonnect.enums.FaqStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FaqRepository extends JpaRepository<Faq, Long> {
    List<Faq> findByStatusOrderBySortOrderAscUpdatedAtDesc(FaqStatus status);

    List<Faq> findAllByOrderBySortOrderAscUpdatedAtDesc();

    Optional<Faq> findFirstByQuestion(String question);

    @Query("""
            select f from Faq f
            where f.status = :status
              and (
                lower(f.question) like lower(concat('%', :q, '%'))
                or lower(f.answer) like lower(concat('%', :q, '%'))
              )
            order by f.sortOrder asc, f.updatedAt desc
            """)
    List<Faq> searchPublished(@Param("status") FaqStatus status, @Param("q") String q, Pageable pageable);
}
