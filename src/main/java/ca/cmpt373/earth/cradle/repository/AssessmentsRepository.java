package ca.cmpt373.earth.cradle.repository;

import ca.cmpt373.earth.cradle.Models.Assessments;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;


//Define Assessments repository
public interface AssessmentsRepository extends MongoRepository<Assessments,String > {

    Assessments findFirstById(String id);

    @Query("{address: '?0'}")
    List<Assessments> findCustomByAddress(String address);

    @Query("{address: {$regex: ?0 } }")
    List<Assessments> findCustomByRegExAddress(String domain);

}

