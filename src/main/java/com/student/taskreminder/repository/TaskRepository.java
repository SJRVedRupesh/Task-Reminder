package com.student.taskreminder.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.student.taskreminder.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

    long countByStatus(String status);
}
