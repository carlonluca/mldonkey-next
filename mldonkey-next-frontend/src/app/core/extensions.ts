interface String {
    caseInsensitiveCompare(s: string): Boolean;
}

String.prototype.caseInsensitiveCompare = function(s: string): Boolean {
    if (!s)
        return true
    return this.toLowerCase() == s.toLowerCase()
}
