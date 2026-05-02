package com.sfs.educonnect.repository;

import com.sfs.educonnect.entity.KbItem;
import com.sfs.educonnect.enums.KbItemStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface KbItemRepository extends JpaRepository<KbItem, Long>, JpaSpecificationExecutor<KbItem> {
    List<KbItem> findTop6ByStatusAndRecommendedTrueOrderByUpdatedAtDesc(KbItemStatus status);

    List<KbItem> findTop6ByStatusOrderByUpdatedAtDesc(KbItemStatus status);

    List<KbItem> findTop6ByStatusAndFeaturedTrueOrderByUpdatedAtDesc(KbItemStatus status);

    List<KbItem> findTop12ByStatusAndRecommendedTrueOrderByUpdatedAtDesc(KbItemStatus status);

    List<KbItem> findTop12ByStatusOrderByUpdatedAtDesc(KbItemStatus status);

    List<KbItem> findTop12ByStatusAndFeaturedTrueOrderByUpdatedAtDesc(KbItemStatus status);

    List<KbItem> findTop20ByStatusAndCategoryIdAndIdNotOrderByUpdatedAtDesc(
            KbItemStatus status,
            Long categoryId,
            Long id
    );

    List<KbItem> findTop200ByStatusAndCategoryIdOrderByUpdatedAtDesc(KbItemStatus status, Long categoryId);

    List<KbItem> findTop200ByStatusOrderByUpdatedAtDesc(KbItemStatus status);

    long countByCategoryIdAndStatus(Long categoryId, KbItemStatus status);

    boolean existsByCategoryId(Long categoryId);

    boolean existsByPolicyId(Long policyId);

    Optional<KbItem> findFirstByTitle(String title);

    @Query("""
            select i from KbItem i
            where i.status = :status
              and (
                lower(i.title) like lower(concat('%', :q, '%'))
                or lower(i.description) like lower(concat('%', :q, '%'))
                or lower(i.content) like lower(concat('%', :q, '%'))
              )
            order by i.updatedAt desc
            """)
    List<KbItem> searchPublished(@Param("status") KbItemStatus status, @Param("q") String q, Pageable pageable);

}
