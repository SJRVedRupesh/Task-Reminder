package com.student.taskreminder.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import com.student.taskreminder.model.Task;
import com.student.taskreminder.repository.TaskRepository;

@Controller
public class TaskController {

    private final TaskRepository repository;

    public TaskController(TaskRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/")
    public String home(Model model) {
        List<Task> tasks = repository.findAll();
        model.addAttribute("tasks", tasks);
        model.addAttribute("today", LocalDate.now());
        return "index";
    }

    @PostMapping("/add")
    public String addTask(@ModelAttribute Task task) {
        repository.save(task);
        return "redirect:/";
    }
}
