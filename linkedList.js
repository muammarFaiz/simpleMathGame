// Linked Lists of nodes
class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }

    // Add a value at beginning of list
    addStart(value) {
        const node = new Node(value);
        node.next = this.head;
        this.head = node;
    }

    // Add a value at end of list
    addEnd(value) {
        const node = new Node(value);
        let curr = this.head; // will always be the 1st addEnd() or the latest addStart()
        if (curr == null) { // if no addStart() prior this addEnd
            this.head = node;
            return;
        }

        while (curr !== null && curr.next !== null) { // 3rd addEnd() and the rest
            curr = curr.next;
        }
        // first loop: curr refer to the value of this.head which is list.addStart(2),
        // but then curr re-assigned to the value of this.head.next which is a class instance 

        curr.next = node; // 2nd addEnd() and the rest
    }
}

const list = new LinkedList();
list.addStart(1);
list.addStart(2);
list.addEnd(3);
list.addEnd(4);
list.addEnd(5);

// console.log(list.head.value);
let count = 0;
let currentNode = list.head
while (currentNode !== null) {
    count++;
    console.log("list head value:");
    console.log(list.head.value);
    console.log(currentNode.value);
    currentNode = currentNode.next;
}
console.log("count: " + count);