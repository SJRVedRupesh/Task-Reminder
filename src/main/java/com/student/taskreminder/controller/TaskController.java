package com.student.taskreminder.controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import com.student.taskreminder.model.Task;
import com.student.taskreminder.repository.TaskRepository;

@Controller
public class TaskController {

    @Autowired
    private TaskRepository repo;

    @GetMapping("/")
    public String dashboard(Model model) {
        model.addAttribute("total", repo.count());
        model.addAttribute("pending", repo.countByStatus("PENDING"));
        model.addAttribute("completed", repo.countByStatus("COMPLETED"));
        model.addAttribute("tasks", repo.findAll());
        return "index";
    }

    @PostMapping("/addTask")
    public String addTask(Task task) {
        task.setStatus("PENDING");
        task.setCreatedAt(LocalDateTime.now());
        repo.save(task);
        return "redirect:/";
    }

    @GetMapping("/complete/{id}")
    public String completeTask(@PathVariable Long id) {
        Task task = repo.findById(id).orElse(null);
        if (task != null) {
            task.setStatus("COMPLETED");
            repo.save(task);
        }
        return "redirect:/";
    }
}
