tasks = realm.All<Task>().Where(t => t.Status == "Open");
