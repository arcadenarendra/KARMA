# KARM Architecture

Browser → Vite `:8443` → `/api` proxy → Express `:8787` → memory store or MongoDB.

MVC: routes → controllers → repositories → models. Views serialize records to the frontend `Issue` shape.
