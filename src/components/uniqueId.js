let lastId = 0;

export function setId(val) {
    lastId = val;
}
export function getId() {
    return lastId;
}
export default function () {
    lastId++;
    return lastId;
}

