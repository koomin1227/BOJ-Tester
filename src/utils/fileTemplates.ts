export const FILE_TEMPLATES: { [key: string]: string } = {
    'java': `import java.io.IOException;

class Main {
    public static void main(String[] args) throws IOException {
        // 코드 작성
    }
}`,
    'c': `#include<stdio.h>

int main() {
    // 코드 작성
    return 0;
}`,
    'cpp': `#include <iostream>
using namespace std;

int main() {
	// 코드 작성
	return 0;
}`

};