export enum Status {
    " " = " ",
    "/" = "/",
    "-" = "-",
    "x" = "x",
    "l" = "l"
}

export const statusLabel = {
    " ": "open",
    "/": "ongoing",
    "-": "canceled",
    "x": "done",
    "l": "location"
}

export const statusIcon = {
    " ": "lucide-circle",
    "/": "lucide-play-circle",
    "-": "lucide-trash-2",
    "x": "lucide-check-circle",
    "l": "lucide-map-pin"
}