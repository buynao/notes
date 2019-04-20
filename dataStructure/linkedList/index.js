/**
 * Definition for singly-linked list.
 * class ListNode {
 *     this.val = val;
 *     this.next = null;
 * }
 */

 /**
  * 链表的基础结构
  */
class Node {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

class LinkedNodeList {
    constructor(val) {
        this.head = val ? new Node(val) : null;
        this.dummyHead = new Node();
        this.dummyHead.next = this.head;
        this.length = val ? 1 : 0;
    }
    /**
     * 向链表尾部添加一个新的项
     * @param {Node} val 
     */
    append(val) {
        var newNode = new Node(val);
        var curNode = this.dummyHead;
        while(curNode.next) { // 找到最后一个元素
            curNode = curNode.next;
        }
        curNode.next = newNode; // 连接到末尾
        this.length++;
        return this.dummyHead.next;
    }
    /** 
     * 向链表的特定位置插入一个新的项
    */
    insert(index, val) {
        var newNode = new Node(val);
        var prevNode = this.dummyHead;
        var curNode = prevNode.next;
        var i = 0;
        if (index > this.length) {
            throw new Error('插入位置大于链表长度')
        } 
        while(i++ < index) { // 迭代，直到目标位置
            prevNode = curNode;
            curNode = curNode.next;
        }
        prevNode.next = newNode; // 找到插入节点的前节点
        newNode.next = curNode; // 注意，是插入不是删除 !=> newNode.next = curNode.next
        this.length++;
    }
    /**
     * 删除链表中指定的某个元素
     * @param {node} val 
     */
    remove(val) {
        var prevNode = this.dummyHead;
        var curNode = prevNode.next;
        if (!val) return;
        while(curNode) {
            if (curNode.val === val) {
                prevNode.next = curNode.next;
                this.length--;
                return;
            }
            curNode = curNode.next;
            prevNode = prevNode.next;
        }
    }
    /**
     * 删除链表中的某个位置
     * @param {node} val 
     */
    removeAt(index) {
        var prevNode = this.dummyHead;
        var curNode = prevNode.next;
        var i = 0;
        if (index >= this.length) {
            throw new Error('删除位置大于链表长度')
        }
        while(i++ < index) { //迭代，直到到达目标位置
            prevNode = curNode;
            curNode = curNode.next;
        }
        prevNode.next = curNode.next; // 指针跳过当前，进行隐式删除
        this.length--;
    }
    /**
     * 判断链表是否为空
     */
    isEmpty() {
        console.log(this.length === 0)
        return this.length === 0;
    }
    /**
     * 获取元素的下标
     */
    indexOf(val) {
        var i = 0;
        var cur = this.dummyHead.next;
        while(cur) {
            if (cur.val === val) {
                console.log(i);
                return i;
            }
            cur = cur.next;
            i++;
        }
        console.log(-1);
        return -1;
    }
    /**
     * 打印链表 1 => 2 => 3 => null
     */
    print() {
        var curNode = this.dummyHead;
        var list = ''
        while(curNode.next) {
            list += `${curNode.next.val} =>`;
            curNode = curNode.next;
        }
        list += 'null';
        console.log(list);
    }
}

var lk = new LinkedNodeList();
lk.isEmpty();
lk.append(1);
lk.append(2);
lk.append(3);
lk.indexOf(1);
lk.print();