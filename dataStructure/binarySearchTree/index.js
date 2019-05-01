class Node{
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree{
    constructor(val) {
        this.root = new Node(val);
        this.length = val ? 1 : 0;
    }
    /**
     * 插入
     */
    insert(val) {
        this.root = this._insert(this.root, val);
    }
    _insert(root, val) {
        if (root === null) {
            this.length++;
            return new Node(val);
        }
        if (root.val > val) {
            root.left = this._insert(root.left, val);
        } else {
            root.right = this._insert(root.right, val);
        }
        return root;
    }
    /**
     * 寻找
     */
    search(val) {
        return this._search(this.root, val);
    }
    _search(root, val) {
        if (!root) {
            return false;
        }
        if (root.val === val) {
            return true;
        }
        if (root.val > val) {
            return this._search(root.left, val);
        } else {
            return this._search(root.right, val);
        }
    }
    /**
     * 递归版中序遍历
     */
    inOrderTraverse() {
        this._inOrderTraverse(this.root);
    }
    _inOrderTraverse(root) {
        if (root) {
            this._inOrderTraverse(root.left);
            console.log(`中序遍历:${root.val}`);
            this._inOrderTraverse(root.right);
        }
    }
    /**
     * 递归版前序遍历
     */
    preOrderTraverse() {
        this._preOrderTraverse(this.root, '');
    }
    _preOrderTraverse(root, str) {
        if (root) {
            console.log(`前序遍历:${root.val}`);
            this._preOrderTraverse(root.left, str);
            this._preOrderTraverse(root.right, str);
        }
    }
    /**
     * 递归版后序遍历
     */
    postOrderTraverse() {
        this._postOrderTraverse(this.root);
    }
    _postOrderTraverse(root) {
        if (root) {
            this._postOrderTraverse(root.left);
            this._postOrderTraverse(root.right);
            console.log(`后序遍历:${root.val}`);
        }
    }
    /**
     * 层序遍历
     */
    levelOrder() {
        var queue = [];
        queue.push(this.root);
        while(queue.length) {
            var node = queue.shift(); // 先进先出，取第一个
            console.log(node.val || 'null');
            if (node.left) {
                queue.push(node.left);
            }
            if (node.right) {
                queue.push(node.right);
            }
        }
    }
    /**
     * 非递归前序遍历
     * 当前 - 左 - 右
     */
    preOrder() {
        var stack = [];
        stack.push(this.root);
        while(stack.length) {
            var node = stack.pop();
            console.log(node.val);
            // 栈的特性，先进后出，先访问当前节点，在访问左节点，最后访问右节点
            if (node.right) {
                stack.push(node.right);
            }
            if (node.left) {
                stack.push(node.left);
            }
        }
    }
    /**
     * 非递归中序遍历
     * 左 - 当前 - 右
     */
    inOrder() {
        var stack = [];
        var root = this.root;
        while(root || stack.length) {
            // 先把当前节点的左节点，进栈
            if (root) {
                stack.push(root);
                root = root.left;
            } else {
                root = stack.pop();
                console.log(root.val);
                root = root.right;
            }
        }
    }
    /**
     * 非递归后序遍历
     * 右 - 左 - 当前
     */
    postOrder() {
        var stack = [];
        var resultStack = [];
        var cur = this.root;
        while(cur || stack.length) {
            while (cur) { // 必须
                stack.push(cur);
                resultStack.push(cur);
                cur = cur.right;
            }
            if (stack.length) {
                cur = stack.pop();
                cur = cur.left;
            }
        }
        while(resultStack.length) {
            var node = resultStack.pop();
            console.log(node.val);
        }
    }
    /** 
     * 寻找最小元素
    */
    miniMum() {
        return this._miniMum(this.root);
    }
    _miniMum(root) {
        if (!root.left) {
            return root;
        }
        return this._miniMum(root.left)
    }
    /** 
     * 寻找最大元素
    */
    maxMum() {
        return this._maxMum(this.root);
    }
    _maxMum(root) {
        if (!root.right) {
            return root;
        }
        return this._maxMum(root.right)
    }
    /**
     * 删除元素 
     * */
    remove(val) {
        if (!val) return false;
        this.root = this._remove(this.root, val)
    }
    _remove(root, val) {
        if (root.val > val) {
            root.left = this._remove(root.left, val);
        } else if (root.val < val) {
            root.right = this._remove(root.right, val);
        } else {
            if (root.left === null & root.right === null) {
                this.length--;
                return null;
            }
            if (root.left === null && root.right) {
                this.length--;
                return root.right;
            }
            if (root.right === null && root.left) {
                this.length--;
                return root.left;
            }

            if (root.right && root.left) {
                var node = this._maxMum(root.left); //
                node.left = this._remove(root.left, node.val);
                node.right = root.right;
                return node;
            }
        }
        return root;
    }
}

var bst = new BinarySearchTree(5);

// 插入
bst.insert(3); //          5
bst.insert(4); //       /     \
bst.insert(7); //      3       7
bst.insert(6); //    /  \     /  \
bst.insert(8); //   2    4   6    8
bst.insert(2); //           /      \ 
bst.insert(5.5);//         5.5      9
bst.insert(9); //                    \
bst.insert(10);//                    10
// 递归遍历
// bst.preOrderTraverse();
// bst.inOrderTraverse();
// bst.postOrderTraverse();

// 非递归遍历
// bst.levelOrder();
// bst.preOrder();
// bst.inOrder();
// bst.postOrder();

// 查找
console.log(`最小元素：${bst.miniMum().val}`)
console.log(`最大元素：${bst.maxMum().val}`)

// 删除
console.log(`删除元素：${bst.remove(7)}`)
console.log(bst);